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
        Schema::create('deal_users', function (Blueprint $table) {
            $table->uuid('deal_id');
            $table->bigInteger('user_id')->unsigned();
            $table->boolean('is_deal_owner')->default(0);
            $table->foreign('deal_id')->references('id')->on('deals')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deal_users');
    }
};
