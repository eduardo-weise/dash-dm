using daily.presenter.Data;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.Services.AddSingleton<PresenterStorage>();

builder.ConfigureFunctionsWebApplication();

builder.Build().Run();
