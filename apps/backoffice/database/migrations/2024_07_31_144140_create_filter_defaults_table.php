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
        Schema::create('filter_defaults', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('filter_id')->nullable();
            $table->bigInteger('user_id')->nullable()->unsigned();
            $table->string('view')->default('deals');
            $table->foreign('filter_id')->references('id')->on('filters')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['user_id', 'filter_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_defaults');
    }
};
