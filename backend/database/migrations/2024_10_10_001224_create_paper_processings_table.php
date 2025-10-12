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
        Schema::create('paper_processings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('paper_id')->nullable();
            $table->uuid('publisher_id')->nullable();
            $table->uuid('journal_id')->nullable();
            $table->uuid('current_revision_id')->nullable();
            $table->text('url')->nullable();
            $table->dateTime('submission_date')->nullable()->default(null);
            $table->dateTime('due_date')->nullable()->default(null);
            $table->json('extra_info')->nullable();
            $table->string('status')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('paper_id')->references('id')->on('papers')->onDelete('cascade');
            $table->foreign('publisher_id')->references('id')->on('master_publishers')->onDelete('set null');
            $table->foreign('journal_id')->references('id')->on('master_journals')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paper_processings');
    }
};
