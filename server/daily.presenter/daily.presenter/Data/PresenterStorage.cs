using Azure.Storage.Blobs;
using daily.presenter.Models;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace daily.presenter.Data;

public class PresenterStorage
{
    private readonly BlobClient _blob;

    public PresenterStorage(IConfiguration config)
    {
        var connection = config["AzureWebJobsStorage"];
        var container = new BlobContainerClient(connection, "presenter");
        container.CreateIfNotExists();
        _blob = container.GetBlobClient("data.json");
    }

    public async Task<PresenterState> ReadAsync()
    {
        if (!await _blob.ExistsAsync())
            return new PresenterState();

        var content = await _blob.DownloadContentAsync();
        return JsonSerializer.Deserialize<PresenterState>(content.Value.Content.ToString())!;
    }

    public async Task WriteAsync(PresenterState state)
    {
        var json = JsonSerializer.Serialize(state, new JsonSerializerOptions { WriteIndented = true });
        await _blob.UploadAsync(BinaryData.FromString(json), overwrite: true);
    }
}
