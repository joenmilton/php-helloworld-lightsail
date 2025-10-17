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
        Schema::create('activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->nullable();
            $table->uuid('activitable_id')->nullable();
            $table->string('activitable_type')->nullable();
            $table->bigInteger('owner_id')->unsigned()->nullable();
            $table->text('title');
            $table->uuid('activity_type_id')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('reminder_in_minutes')->default(0);
            $table->integer('reminder_minutes')->default(0);
            $table->string('reminder_type')->default('minutes');
            $table->longText('description')->nullable();
            $table->longText('note')->nullable();
            $table->boolean('completed')->default(false);
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('activity_type_id')->references('id')->on('activity_types')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
