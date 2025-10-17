<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Casts\Attribute;

class BillableProduct extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
        'unit_price',
        'qty',
        'unit',
        'tax_rate',
        'tax_label',
        'discount_type',
        'discount_total',
        'note',
        'product_id',
    ];

    protected $casts = [
        'unit_price' => 'decimal:3',
        'tax_rate' => 'decimal:3',
        'qty' => 'decimal:2',
        'discount_total' => 'decimal:2',
        'amount' => 'decimal:3',
    ];

    protected static function boot() {
        parent::boot();

        static::creating(function ($model) {
            $model->amount = $model->totalAmount();
        });

        static::updating(function ($model) {
            $model->amount = $model->totalAmount();
        });
    }

    public function originalProduct() {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function billable() {
        return $this->belongsTo(Billable::class);
    }
    
    public function sku() : Attribute {
        return Attribute::make(
            get: fn () => $this->originalProduct?->sku
        );
    }

    public function taxRate() : Attribute {
        return Attribute::make(
            get: function () {
                if (! $this->billable->isTaxable()) {
                    return 0;
                }
                return $this->attributes['tax_rate'] ?? 0;
            }
        );
    }


    public function totalAmount() {
        $taxAmount = $this->totalTaxAmount();

        return Billable::round(
            $this->billable->isTaxInclusive() ? $taxAmount + $this->totalAmountBeforeTax() : $this->totalAmountBeforeTax()
        );
    }




    public function totalAmountWithDiscount() {
        $unitPrice = $this->unit_price;
        $qty = 1;

        return Billable::round(
            ($unitPrice * $qty) - $this->totalDiscountAmount(),
            2
        );


        // $unitPrice = $this->unit_price;
        // $qty = $this->qty;

        // return Billable::round(
        //     ($unitPrice * $qty) - $this->totalDiscountAmount()
        // );
    }

    public function totalDiscountAmount() {
        if ($this->discount_type === 'fixed') {
            return Billable::round($this->discount_total / $this->qty);
        }

        $discountRate = $this->discount_total;
        $unitPrice = $this->unit_price;
        $qty = 1;

        if ($this->billable->isTaxInclusive()) {
            return Billable::round(($discountRate / 100) * ($unitPrice) * $qty);
        }

        return Billable::round(($discountRate / 100) * ($unitPrice * $qty));



        // if ($this->discount_type === 'fixed') {
        //     return $this->discount_total;
        // }

        // $discountRate = $this->discount_total;
        // $unitPrice = $this->unit_price;
        // $qty = $this->qty;

        // if ($this->billable->isTaxInclusive()) {
        //     return Billable::round(($discountRate / 100) * ($unitPrice) * $qty);
        // }

        // return Billable::round(($discountRate / 100) * ($unitPrice * $qty));
    }






    public function totalTaxAmount() {

        if (! $this->billable->isTaxable()) {
            return 0;
        }

        $unitPrice = $this->unit_price;
        $qty = $this->qty;
        $taxRate = $this->tax_rate;

        if ($this->billable->isTaxInclusive()) {
            $amount = $qty * (
                ($unitPrice - $this->totalDiscountAmount()) -
                ($unitPrice - $this->totalDiscountAmount()) / (1 + ($taxRate / 100))
            );
        } else {
            $amount = $qty * (($unitPrice - $this->totalDiscountAmount()) * ($taxRate / 100));
        }

        return Billable::round($amount);
    }

    public function totalAmountBeforeTax() {
        if (! $this->billable->isTaxable()) {
            return $this->qty * $this->totalAmountWithDiscount();
        }

        $unitPrice = $this->unit_price;
        $qty = $this->qty;
        $taxRate = $this->tax_rate;

        if ($this->billable->isTaxInclusive()) {
            $amount = $qty * (($unitPrice - $this->totalDiscountAmount()) / (1 + ($taxRate / 100)));
        } else {
            $amount = $qty * ($unitPrice - $this->totalDiscountAmount());
        }

        return Billable::round($amount);
    }
}
