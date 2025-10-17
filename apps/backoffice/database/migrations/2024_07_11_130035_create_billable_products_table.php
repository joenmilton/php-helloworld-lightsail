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
        Schema::create('billable_products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('unit_price', 10, 2);
            $table->integer('qty');
            $table->string('unit');
            $table->decimal('tax_rate', 15, 3)->default('0.00');
            $table->string('tax_label')->default('TAX');
            $table->string('discount_type');
            $table->decimal('discount_total', 15, 3)->default('0.00');
            $table->decimal('amount', 10, 2);
            $table->text('note')->nullable();
            $table->uuid('billable_id')->nullable();
            $table->uuid('product_id')->nullable();
            $table->timestamps();
            $table->foreign('billable_id')->references('id')->on('billables')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billable_products');
    }
};
