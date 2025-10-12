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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('transaction_type')->nullable()->default('bank'); //bank, cash

            $table->uuid('bank_id')->nullable();
            $table->string('transaction_id')->nullable();
            $table->integer('transaction_split')->nullable()->default(1);

            $table->foreign('bank_id')->references('id')->on('banks')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // $table->dropForeign(['bank_id']);
            // $table->dropColumn('bank_id');

            // $table->dropColumn('transaction_type');
            // $table->dropColumn('transaction_id');
            // $table->dropColumn('transaction_split');
        });
    }
};
