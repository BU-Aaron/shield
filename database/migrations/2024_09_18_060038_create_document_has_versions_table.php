<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('document_has_versions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('mime');
            $table->integer('size');
            $table->uuid('document_item_id');
            $table->string('review_status')->nullable();
            $table->string('approval_status')->nullable();
            $table->string('file_path');
            $table->boolean('current')->default(false);
            $table->timestamps();

            $table->foreign('document_item_id')
                ->references('item_id')
                ->on('documents')
                ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('document_has_versions');
    }
};
