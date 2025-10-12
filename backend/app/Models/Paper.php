<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;
use App\Sigapps\Filterable;
use App\Sigapps\Sortable;

class Paper extends Model
{
    use HasFactory, HasUuids, SoftDeletes, Filterable, Sortable;

    protected $fillable = [
        'journalable_id',
        'journalable_type',
        'domain',
        'confirmation_date',
        'deadline',
        'paper',
        'service',
        'status'
    ];

    protected $dates = ['deleted_at'];

    public function processing() {
        return $this->hasMany(PaperProcessing::class, 'paper_id');
    }

    public function domain() {
        return $this->belongsTo(MasterDomain::class, 'domain_id');
    }

    public function service() {
        return $this->belongsTo(MasterService::class, 'service_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'paper_users', 'paper_id', 'user_id');
    }

    public function scopeGetVisiblePapers($query) {

        $query->join('deals as parent', 'parent.id', '=', 'papers.journalable_id')
            ->leftJoin('paper_users as users', 'users.paper_id', '=', 'papers.id')
            ->leftJoin('users as client', 'client.id', '=', 'parent.contact_id')
            ->leftJoin('users as owner', 'owner.id', '=', 'parent.owner_id')
            ->whereNull('parent.deleted_at')
            ->whereNull('papers.deleted_at')
            ->groupBy('papers.id');

        $user = Auth::user();
        if ($user->hasRole('admin')) {
            return $query;
        }

        if ($user->can('view all journals')) {
            return $query;
        }
        
        $query->leftJoin('deals as child', 'child.parent_id', '=', 'parent.id')
            ->leftJoin('deal_users as parent_users', 'parent_users.deal_id', '=', 'parent.id')
            ->leftJoin('deal_users as child_users', 'child_users.deal_id', '=', 'child.id');

        if($user->can('view deal journals')) {
            $query->where(function ($subQuery) use($user){
                $subQuery->where('parent.owner_id', $user->id)
                    ->orWhere('child.owner_id', $user->id)
                    ->orWhere('users.user_id', $user->id)
                    ->orWhere('parent_users.user_id', $user->id)
                    ->orWhere('child_users.user_id', $user->id);
            });

            return $query;
        }

        if ($user->can('view own journals')) {
            $query->where('users.user_id', $user->id);
            return $query;
        }

        return $query;
    }
}
