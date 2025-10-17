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
        Schema::create('filters', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('identifier')->default('deals');
            $table->bigInteger('user_id')->nullable()->unsigned();
            $table->boolean('is_shared')->default(false);
            $table->boolean('is_readonly')->default(true);
            $table->json('rules')->nullable();
            $table->string('flag');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
            $table->index(['user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filters');
    }
};
