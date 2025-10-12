<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Facades\ChangeLogger;
use Auth;

use App\Sigapps\Filterable;
use App\Sigapps\Sortable;

class Payment extends Model
{
    use HasFactory, HasUuids, SoftDeletes, Filterable, Sortable;

    protected $fillable = [
        'id', 
        'product_id', 
        'payable_id', 
        'payable_type', 
        'paid_amount', 
        'description', 
        'paid_at', 
        'status',

        'bank_id',
        'transaction_type',
        'transaction_id',
        'transaction_split'
    ];

    protected $dates = ['deleted_at'];

    protected $appends = ['is_loading', 'status_label'];

    public function getStatusLabelAttribute() {
        return $this->status === 1 ? 'Verified' : 'Not Verified';
    }

    public function logPaymentChange($type = 'payment_change') {
        ChangeLogger::logPaymentChangeActivity($this->payable, $this, null, $type);
    }

    public function getIsLoadingAttribute() {
        return false;
    }

    public function media() {
        return $this->morphMany(Media::class, 'mediable');
    }
    
    public function payable() {
        return $this->morphTo();
    }

    public function product() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function bank() {
        return $this->belongsTo(Bank::class, 'bank_id');
    }

    public function scopeGetVisiblePayments($query) {
        $query->join('deals', 'deals.id', '=', 'payments.payable_id')
            ->leftJoin('users as contact', 'contact.id', '=', 'deals.contact_id')
            ->leftJoin('users as owner', 'owner.id', '=', 'deals.owner_id')
            ->leftJoin('products', 'products.id', '=', 'payments.product_id')
            ->whereNull('deals.deleted_at')
            ->whereNull('payments.deleted_at')
            ->groupBy('payments.id');

        $user = Auth::user();
        if ($user->hasRole('admin')) {
            return $query;
        }

        if ($user->can('view payments')) {
            return $query;
        }
        
        $query->where(function ($q) use ($user) {
            if ($user->can('view own payments')) {
                $q->Where('deals.owner_id', $user->id);
            }
        });

        return $query;
    }
}
