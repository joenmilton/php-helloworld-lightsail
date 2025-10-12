<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $dates = ['deleted_at'];
    
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'unit_price',
        'direct_cost',
        'unit',
        'tax_rate',
        'tax_label',
        'sku',
        'is_active',
        'created_by'
    ];
}
