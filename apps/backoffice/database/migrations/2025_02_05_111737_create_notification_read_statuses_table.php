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
        Schema::create('notification_read_statuses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('notification_id')->nullable();
            $table->bigInteger('user_id')->unsigned()->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->foreign('notification_id')->references('id')->on('notifications')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['notification_id', 'user_id']);
            $table->index(['user_id', 'notification_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notification_read_statuses');
    }
};
