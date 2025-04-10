<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('item_id')->primary();
            $table->unsignedBigInteger('owned_by');
            $table->string('name');
            $table->string('mime');
            $table->string('size');
            $table->string('document_number')->nullable();
            $table->string('review_status')->nullable();
            $table->string('approval_status')->nullable();
            $table->string('description')->nullable();
            $table->string('due_date')->nullable();
            $table->string('file_path');
            $table->string('category')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('item_id')
                ->references('id')
                ->on('items')
                ->onDelete('cascade');

            $table->foreign('owned_by')
                ->references('id')
                ->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('documents');
    }
};
