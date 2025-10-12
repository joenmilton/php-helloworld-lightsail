<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Auth;

class Comment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];
    
    protected $fillable = [
        'user_id',
        'commentable_id',
        'commentable_type',
        'body'
    ];

    protected $appends = ['editing', 'comment_text', 'is_owner', 'is_author'];

    public function getIsOwnerAttribute() {
        return $this->user_id === Auth::id() || Auth::user()->hasRole('admin');
    }

    public function getIsAuthorAttribute() {
        return $this->user_id === Auth::id();
    }

    public function getEditingAttribute() {
        return false;
    }
    public function getCommentTextAttribute() {
        return $this->body;
    }

    public function commentable() {
        return $this->morphTo();
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
