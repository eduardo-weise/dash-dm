using daily.presenter.Data;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Net;

namespace daily.presenter.Rules;

public class PresenterFunction(PresenterStorage storage)
{
    private readonly PresenterStorage _storage = storage;

    [Function("GetPresenter")]
    public async Task<HttpResponseData> Get(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "presenter")] HttpRequestData req)
    {
        var state = await _storage.ReadAsync();
        state = PresenterRules.ApplyRotation(state);
        await _storage.WriteAsync(state);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(state);
        return response;
    }

    [Function("SkipPresenter")]
    public async Task<HttpResponseData> Skip(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "presenter/skip")] HttpRequestData req)
    {
        var state = await _storage.ReadAsync();
        PresenterRules.Skip(state);
        await _storage.WriteAsync(state);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(state);
        return response;
    }
}
