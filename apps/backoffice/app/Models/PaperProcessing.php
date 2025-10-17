<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Facades\ChangeLogger;

class PaperProcessing extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'paper_id',
        'publisher_id',
        'journal_id',
        'current_revision_id',
        'url',
        'submission_date',
        'due_date',
        'extra_info',
        'status',
        'shared'
    ];

    protected $dates = ['deleted_at'];

    protected $appends = ['is_loading', 'process_status', 'is_open'];
    
    protected $casts = [
        'extra_info' => 'array',
    ];
    
    public function getIsLoadingAttribute() {
        return false;
    }

    public function logJournalChange($type = 'journal_change') {
        ChangeLogger::logJournalChangeActivity($this->journalable, $this, null, $type);
    }

    public function getIsOpenAttribute() {
        return false;
    }

    public function getProcessStatusAttribute() {
        return ( !is_null($this->status) && $this->status !== '' ) ? $this->status : '';
    }

    public function journalable() {
        return $this->morphTo();
    }

    public function journal() {
        return $this->belongsTo(MasterJournal::class, 'journal_id');
    }

    public function publisher() {
        return $this->belongsTo(MasterPublisher::class, 'publisher_id');
    }

    public function current_revision() {
        return $this->belongsTo(ProcessRevision::class, 'current_revision_id');
    }

    public function submission() {
        return $this->hasOne(ProcessRevision::class, 'processing_id')->where('revision_type', 'submission');
    }

    public function revisions() {
        return $this->hasMany(ProcessRevision::class, 'processing_id')->where('revision_type', 'revision');
    }

    public function proof() {
        return $this->hasOne(ProcessProof::class, 'processing_id');
    }
}
