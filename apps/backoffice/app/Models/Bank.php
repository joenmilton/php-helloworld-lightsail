<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bank extends Model
{

    use HasFactory, HasUuids, SoftDeletes;
    
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name',
        'account_number',
        'detail',
        'active'
    ];

    protected $appends = ['is_loading'];

    public function getIsLoadingAttribute() {
        return false;
    }
}
