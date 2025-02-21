<html>
    <head>
        <style>
            /**
                Set the margins of the page to 0, so the footer and the header
                can be of the full height and width !
             **/
            @page {
                margin: 0cm 0cm;
            }

            /** Define now the real margins of every page in the PDF **/
            body {
                margin-top: 5cm;
                margin-left: 2cm;
                margin-right: 2cm;
                margin-bottom: 2cm;
            }

            /** Define the header rules **/
            header {
                position: fixed;
                top: 0cm;
                left: 0cm;
                right: 0cm;
                height: 4cm;
            }

            /** Define the footer rules **/
            footer {
                position: fixed;
                bottom: 0cm;
                left: 0cm;
                right: 0cm;
                height: 3.5cm;
            }

            /** Titles **/
            h1 {
                font-size: 24px;
                margin: 0;
            }

            h2 {
                font-size: 20px;
                margin: 0;
            }

            /** Table **/
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }

            th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }

            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <!-- Define header and footer blocks before your content -->
        <header>
            <img src="{{ $header }}" width="100%" height="100%"/>
        </header>

        <footer>
            <img src="{{ $footer }}" width="100%" height="100%"/>
        </footer>

        <!-- Wrap the content of your PDF inside a main tag -->
        <main>
            <h1>Dashboard Report</h1>

            <!-- Display Date Range -->
            <p><strong>Date Range:</strong> {{ $start_date }} - {{ $end_date }}</p>

            <!-- Display Total Documents -->
            <p><strong>Total Documents:</strong> {{ $totalDocuments }}</p>

            <h2>Documents</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Modified</th>
                        @foreach($selectedMetadata as $metadataColumn)
                            <th>{{ $metadataColumn->name }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @foreach($items as $item)
                        <tr>
                            <td>{{ $item->name }}</td>
                            <td>{{ $item->updated_at }}</td>
                            @foreach($selectedMetadata as $metadataColumn)
                                @php
                                    $meta = collect($item->metadata)->firstWhere('metadata_id', $metadataColumn->metadata_id);
                                @endphp
                                <td>{{ $meta['value'] ?? '-' }}</td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </main>
    </body>
</html>
