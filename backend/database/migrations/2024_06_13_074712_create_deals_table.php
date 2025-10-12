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
        Schema::create('deals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('name');
            $table->bigInteger('owner_id')->unsigned()->nullable();
            $table->uuid('pipeline_id');
            $table->uuid('stage_id');
            $table->bigInteger('contact_id')->unsigned()->nullable();
            $table->integer('sort_order')->default(100);
            $table->boolean('has_products')->default(false);
            $table->decimal('amount', 15, 2)->default('0.00');
            $table->decimal('paid_amount', 15, 2)->default('0.00');
            $table->timestamp('expected_close_date')->nullable();
            $table->enum('status', [1, 2, 3])->default(1); //1 - open, 2 - won, 3- lost
            $table->dateTime('won_date')->nullable()->default(null);
            $table->dateTime('lost_date')->nullable()->default(null);
            $table->text('lost_reason')->nullable();

            $table->foreign('owner_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('pipeline_id')->references('id')->on('pipelines')->onDelete('cascade');
            $table->foreign('stage_id')->references('id')->on('pipeline_stages')->onDelete('cascade');
            $table->foreign('contact_id')->references('id')->on('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deals');
    }
};
