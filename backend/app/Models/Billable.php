<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

use App\Facades\ChangeLogger;
use Log;

class Billable extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'billableable_type', 'billableable_id', 'tax_type', 'notes', 
        'subtotal', 'total', 'total_tax', 'total_discount'
    ];
    

    public function logProductChange($billableData) {
        ChangeLogger::logProductChangeActivity($this->billableable, $billableData);
    }


    public function updateAggregates() {
        try {
            $this->subtotal = $this->subTotalCal();
            $this->total_discount = $this->totalDiscountCal();
            $this->total_tax = $this->calculateTotalTax();
            $this->total = $this->subTotal + (! $this->isTaxInclusive() ? $this->totalTax : 0);
            $this->save();

            if ($this->billableable_type === Deal::class) {
                $deal = $this->billableable;
                $deal->amount = $this->total;
                $deal->has_products = ($this->products->count() > 0) ? true : false;
                $deal->save();
            }

        } catch (\Exception $e) {
            // Log the exception for debugging
            \Log::error('Update Aggregates Error: ' . $e->getMessage());
        }
    }

    public function calculateTotalTax() {
        if($this->products->count() <= 0) {
            return 0;
        }

        // Calculate total tax based on products
        return $this->products->reduce(function ($total, $product) {
            return $total + $product->totalTaxAmount();
        }, 0);
    }


    public function billableable() {
        return $this->morphTo();
    }

    public function products() {
        return $this->hasMany(BillableProduct::class);
    }

    public function isTaxExclusive() : bool {
        return $this->tax_type === 'exclusive';
    }

    public function isTaxInclusive() : bool {
        return $this->tax_type === 'inclusive';
    }

    public function isTaxable() : bool {
        return $this->tax_type !== 'no_tax';
    }


    
    public function total() : Attribute {
        return Attribute::make(
            get: fn () => $this->round(
                $this->subTotal + (! $this->isTaxInclusive() ? $this->totalTax : 0)
            )
        );
    }

    public function subTotal() : Attribute {
        return Attribute::make(
            get: fn () => $this->round(
                $this->subTotalCal()
            )
        );
    }
    private function subTotalCal()  {
        return $this->products->reduce(function ($total, $product) {
            return $total + ($product->qty * $product->totalAmountWithDiscount());
        }, 0);
    } 





    public function hasDiscount() : Attribute {
        return Attribute::make(
            get: fn () => $this->total_discount > 0
        );
    }

    public function totalDiscount() : Attribute {
        return Attribute::make(
            get: fn () => $this->round(
                $this->totalDiscountCal()
            )
        );
    }
    private function totalDiscountCal()  {
        return $this->products->reduce(function ($total, $product) {
            return $total + ($product->qty * $product->totalDiscountAmount());
        }, 0);
    }






    public function totalTax() : Attribute {
        return Attribute::make(
            get: fn () => $this->round(
                collect($this->getAppliedTaxes())->reduce(function ($total, $tax) {
                    return $total + $tax['total'];
                }, 0)
            )
        );
    }

    public function getAppliedTaxes() : array {
        if (! $this->isTaxable()) {
            return [];
        }

        return collect($this->products->unique(function ($product) {
            return $product->tax_label . $product->tax_rate;
        })
            ->sortBy('tax_rate')
            ->where('tax_rate', '>', 0)
            ->reduce(function ($groups, $tax) {
                $groups[] = [
                    'key'   => $tax->tax_label . $tax->tax_rate,
                    'rate'  => $tax->tax_rate,
                    'label' => $tax->tax_label,
                    'total' => $this->products->filter(function ($product) use ($tax) {
                        return $product->tax_label === $tax->tax_label && $product->tax_rate === $tax->tax_rate;
                    })->reduce(fn ($total, $product) => $total + $this->totalTaxInAmount(
                        $product->totalAmountWithDiscount(),
                        $product->tax_rate,
                        $this->isTaxInclusive(),
                        $product->qty
                    ), 0),
                ];

                return $groups;
            }, []))->map(function ($tax) {
                $tax['total'] = $this->round($tax['total']);

                return $tax;
            })->all();
    }

    public static function round($number, $decimal = 2) {
        return floatval(number_format($number, $decimal, '.', ''));
    }

    
    protected function totalTaxInAmount($fromAmount, $taxRate, $isTaxInclusive, $qty) {
        if ($isTaxInclusive) {
            return $qty * (($fromAmount) - ($fromAmount / (1 + ($taxRate / 100))));
        }

        return $qty * (($fromAmount * ($taxRate / 100)));
    }





    public function getProductSummaryWithPayments() {
        // Step 1: Fetch and group Billable Products by product_id
        $billableProducts = BillableProduct::selectRaw('product_id, SUM(amount) as total_amount, SUM(qty) as total_qty')
            ->addSelect('billable_products.name')
            ->join('products', 'products.id', '=', 'billable_products.product_id')
            ->where('billable_id', $this->id)
            ->groupBy('product_id')
            ->get();

        // Step 2: Collect product summaries with payments
        $productSummaries = $billableProducts->map(function($product) {
            // Fetch associated payments for the current product
            $payments = Payment::where('product_id', $product->product_id)
                ->where('payable_id', $this->billableable_id)
                ->where('payable_type', $this->billableable_type)
                ->whereNull('deleted_at')
                ->get()
                ->map(function($payment) {
                    return [
                        'id' => $payment->id,
                        'paid_amount' => $payment->paid_amount,
                        'media' => $payment->media,
                        'description' => $payment->description,
                        'paid_at' => $payment->paid_at,
                        'is_loading' => false,
                        'status' => $payment->status,
                    ];
                });


            // Calculate the total paid amount where payment status is 1
            $totalPaid = $payments->where('status', 1)->sum('paid_amount');

            // Calculate the balance to pay
            $balanceToPay = $product->total_amount - $totalPaid;


            // Return the product summary with payments
            return [
                'product_id' => $product->product_id,
                'name' => $product->name,
                'amount' => $product->total_amount,
                'total_paid' => $totalPaid,
                'balance_to_pay' => $balanceToPay,
                'qty' => $product->total_qty,
                'payments' => $payments
            ];
        });

        return $productSummaries;
    }
}
