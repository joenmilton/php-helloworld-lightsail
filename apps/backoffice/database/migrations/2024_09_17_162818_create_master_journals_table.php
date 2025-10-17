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
        Schema::create('master_journals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('publisher_id')->nullable();
            $table->text('journal_name')->nullable();
            $table->foreign('publisher_id')->references('id')->on('master_publishers')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_journals');
    }
};
