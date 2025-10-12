<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('payable_id');
            $table->string('payable_type')->nullable();
            $table->uuid('product_id')->nullable();
            $table->decimal('paid_amount', 15, 2);
            $table->text('description')->nullable();
            $table->timestamp('paid_at');
            $table->boolean('status')->default(false);
            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['payable_id', 'payable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
