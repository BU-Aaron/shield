<?php

namespace App\Modules\Archive\Controllers;

use App\Modules\Archive\Models\ArchiveFrequency;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Modules\Common\Controllers\Controller;

class ArchiveFrequencyController extends Controller
{
    /**
     * Retrieve the current archive frequency and status.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getYears(): JsonResponse
    {
        $frequency = ArchiveFrequency::first();

        return response()->json([
            'years' => $frequency ? $frequency->years : null,
            'enabled' => $frequency ? $frequency->enabled : false,
        ]);

        dd($frequency);
    }

    /**
     * Update the archive frequency and status.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateYears(Request $request): RedirectResponse
    {
        $request->validate([
            'years' => 'required|integer|min:1',
            'enabled' => 'required|boolean',
        ]);

        $years = $request->input('years');
        $enabled = $request->input('enabled');

        $frequency = ArchiveFrequency::first();

        if ($frequency) {
            $frequency->update(['years' => $years, 'enabled' => $enabled]);
        } else {
            ArchiveFrequency::create(['years' => $years, 'enabled' => $enabled]);
        }

        return redirect()->back()->with('success', 'Archive options updated successfully.');
    }
}
