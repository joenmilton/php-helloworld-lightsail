<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordResetsOtp extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp',
        'created_at'
    ];
}
