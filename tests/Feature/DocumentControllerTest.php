<?php

namespace Tests\Feature;

use Modules\Folder\Actions\CreateFolderAction;
use Modules\Folder\Data\CreateFolderData;
use Modules\User\Models\User;
use Modules\Workspace\Actions\CreateWorkspaceAction;
use Modules\Workspace\Data\CreateWorkspaceData;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_document_upload()
    {
        // Fake the storage
        Storage::fake('public');

        // Create a user and authenticate
        /** @var User $user */
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create Workspace
        $createWorkspaceAction = app(CreateWorkspaceAction::class);
        $workspace = $createWorkspaceAction->execute(new CreateWorkspaceData(
            name: 'Test Workspace'
        ));

        // Create Folder
        $createFolderAction = app(CreateFolderAction::class);
        $folder = $createFolderAction->execute(new CreateFolderData(
            parent_id: $workspace->item_id,
            name: 'Test Folder'
        ));

        // Create a fake file
        $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        // Send a POST request with the file
        $response = $this->post('/document', [
            'parent_id' => $folder->item_id,
            'name' => 'Test Document',
            'file' => $file,
        ]);

        // Assert the response status
        $response->assertStatus(201);
        // Assert the file was stored
        $this->assertTrue(Storage::disk('public')->exists('documents/' . $file->hashName()));

        // Assert the document was created in the database
        $this->assertDatabaseHas('documents', [
            'name' => 'Test Document',
            'file_path' => 'documents/' . $file->hashName(),
        ]);
    }
}
