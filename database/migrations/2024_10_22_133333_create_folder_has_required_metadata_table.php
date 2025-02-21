<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('folder_has_required_metadata', function (Blueprint $table) {
            $table->id();
            $table->uuid('folder_item_id');
            $table->unsignedBigInteger('metadata_id');
            $table->timestamps();

            $table->foreign('folder_item_id')
                ->references('item_id')
                ->on('folders')
                ->onDelete('cascade');

            $table->foreign('metadata_id')
                ->references('id')
                ->on('metadata')
                ->onDelete('cascade');

            $table->unique(['folder_item_id', 'metadata_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('folder_has_required_metadata');
    }
};
