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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->uuid('category_id')->nullable();
            $table->decimal('unit_price', 15, 3)->default('0.00');
            $table->decimal('direct_cost', 15, 3)->default('0.00');
            $table->string('unit')->default('no');
            $table->decimal('tax_rate', 15, 3)->default('0.00');
            $table->string('tax_label')->default('TAX');
            $table->string('sku')->nullable();
            $table->boolean('is_active')->default(true);
            $table->bigInteger('created_by')->unsigned();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
