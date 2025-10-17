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
        Schema::table('users', function (Blueprint $table) {
            // Add the owner_id column referencing the id of the users table
            $table->foreignId('owner_id')->nullable()
                ->constrained('users', 'id')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
            $table->dropColumn('owner_id');

            // $table->dropForeign(['owned_deal_id']);
            // $table->dropColumn('owned_deal_id');

            // $table->dropColumn('owned_deal_at');
        });
    }
};
