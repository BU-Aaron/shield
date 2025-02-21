<?php

namespace Modules\NumberingScheme\Actions;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Modules\NumberingScheme\Models\NumberingScheme;

class GenerateDocumentNumberAction
{
    public function execute(NumberingScheme $numberingScheme): string
    {
        return DB::transaction(function () use ($numberingScheme) {
            $date = Carbon::now();
            $prefix = $numberingScheme->prefix;
            $resetFrequency = $numberingScheme->reset_frequency;
            $lastResetDate = $numberingScheme->last_reset_date;

            // Determine if reset is needed
            $shouldReset = false;

            if ($resetFrequency === 'monthly') {
                if (
                    !$lastResetDate ||
                    $date->month !== Carbon::parse($lastResetDate)->month ||
                    $date->year !== Carbon::parse($lastResetDate)->year
                ) {
                    $shouldReset = true;
                }
            } elseif ($resetFrequency === 'yearly') {
                if (!$lastResetDate || $date->year !== Carbon::parse($lastResetDate)->year) {
                    $shouldReset = true;
                }
            }

            if ($shouldReset) {
                $numberingScheme->next_number = 1;
                $numberingScheme->last_reset_date = $date->toDateString();
            }

            $currentNumber = $numberingScheme->next_number;
            $numberingScheme->next_number += 1;
            $numberingScheme->save();

            $number = $prefix;

            // Remove curly braces from static text
            $number = str_replace(['{', '}'], '', $number);

            // Replace date placeholders
            $number = str_replace('[DD]', $date->format('d'), $number);
            $number = str_replace('[MM]', $date->format('m'), $number);
            $number = str_replace('[YY]', $date->format('y'), $number);
            $number = str_replace('[YYYY]', $date->format('Y'), $number);

            // Replace [INC] placeholder with the current number without padding
            $number = str_replace('[INC]', (string)$currentNumber, $number);

            return $number;
        });
    }
}
