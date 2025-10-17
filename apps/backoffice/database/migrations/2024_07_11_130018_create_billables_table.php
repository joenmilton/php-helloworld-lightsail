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
        Schema::create('billables', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('tax_type');
            $table->text('notes')->nullable();
            $table->string('billableable_type');
            $table->uuid('billableable_id')->nullable();

            $table->decimal('subtotal', 10, 3)->default(0);
            $table->decimal('total', 10, 3)->default(0);
            $table->decimal('total_tax', 10, 3)->default(0);
            $table->decimal('total_discount', 10, 3)->default(0);
            
            $table->softDeletes();
            $table->timestamps();

            $table->index(['billableable_type', 'billableable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billables');
    }
};
