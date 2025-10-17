<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class ProcessRevision extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $appends = ['duedate_text', 'fetch_as', 'enable_task_attach'];

    public function staff() {
        return $this->belongsTo(User::class, 'revised_by');
    }

    public function activity() {
        return $this->belongsTo(Activity::class, 'activity_id');
    }

    public function getEnableTaskAttachAttribute() {
        return ( !is_null($this->activity_id) && $this->activity_id !== '' ) ? true : false;
    }

    public function getFetchAsAttribute() {
        return ( !is_null($this->activity_id) && $this->activity_id !== '' ) ? 'existing' : 'new';
    }

    public function getDuedateTextAttribute() {
        if(is_null($this->due_date)) {
            return 'No Due Date';
        }
        
        $duedate = Carbon::parse($this->due_date);
        $now = Carbon::now();

        if ($duedate->isToday()) {
            return 'Today';
        } elseif ($duedate->isFuture()) {
            $diffInDays = $now->diffInDays($duedate);
            return ($diffInDays === 1) ? '1 day left' : "{$diffInDays} days left";
        } else {
            return $duedate->format('M, d Y');
        }
    }
}
