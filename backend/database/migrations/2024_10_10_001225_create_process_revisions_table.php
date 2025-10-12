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
        Schema::create('process_revisions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('processing_id')->nullable();
            $table->bigInteger('created_by')->unsigned()->nullable();
            $table->bigInteger('revised_by')->unsigned()->nullable();
            $table->uuid('activity_id')->nullable();
            $table->string('revision_type')->nullable(); //submission, revision
            $table->dateTime('due_date')->nullable()->default(null);
            $table->dateTime('submission_date')->nullable()->default(null);
            $table->dateTime('rejected_date')->nullable()->default(null);
            $table->text('rejected_reason')->nullable();
            $table->string('status')->nullable();
            $table->integer('serial')->default(1);
            $table->foreign('processing_id')->references('id')->on('paper_processings')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('revised_by')->references('id')->on('users')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('process_revisions');
    }
};
