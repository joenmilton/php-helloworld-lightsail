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
        Schema::create('visibility_groups', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', ['all', 'teams', 'users']);
            $table->string('visibilityable_type');
            $table->uuid('visibilityable_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visibility_groups');
    }
};
