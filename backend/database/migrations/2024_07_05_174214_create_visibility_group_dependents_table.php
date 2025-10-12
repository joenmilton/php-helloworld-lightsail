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
        Schema::create('visibility_group_dependents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('visibility_group_id');
            $table->string('dependable_type');
            $table->string('dependable_id');
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('visibility_group_id')->references('id')->on('visibility_groups')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visibility_group_dependents');
    }
};
