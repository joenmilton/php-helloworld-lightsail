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
            $table->string('whatsapp')->nullable()->after('email');
            $table->string('referral_code')->nullable()->after('whatsapp');
            $table->bigInteger('referred_by')->nullable()->after('referral_code');
            $table->enum('source_type', ['team', 'admin', 'app'])->nullable()->default('team')->after('referred_by');
            $table->boolean('phone_verified')->default(false)->after('referral_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // $table->dropColumn(['referral_code', 'referred_by', 'source_type']);
        });
    }
};
