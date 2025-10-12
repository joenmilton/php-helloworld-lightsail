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
        Schema::table('deals', function (Blueprint $table) {
            $table->dateTime('owner_rewarded_at')->nullable();
            $table->uuid('internal_reference_id')->nullable();
            $table->foreign('internal_reference_id')->references('id')->on('internal_references')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deals', function (Blueprint $table) {
            // $table->dropColumn('owner_rewarded_at');
            // $table->dropColumn('internal_reference_id');
        });
    }
};
