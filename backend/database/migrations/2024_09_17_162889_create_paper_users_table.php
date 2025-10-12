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
        Schema::create('paper_users', function (Blueprint $table) {
            $table->uuid('paper_id');
            $table->bigInteger('user_id')->unsigned();
            $table->boolean('is_paper_owner')->default(0);
            $table->foreign('paper_id')->references('id')->on('papers')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_users');
    }
};
