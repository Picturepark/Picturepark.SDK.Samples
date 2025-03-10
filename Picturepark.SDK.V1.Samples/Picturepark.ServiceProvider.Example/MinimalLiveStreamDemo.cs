using System;
using System.Threading.Tasks;
using Picturepark.SDK.V1.ServiceProvider;

namespace Picturepark.ServiceProvider.Example
{
	public class MinimalLiveStreamDemo : IAsyncDisposable
	{
		private ServiceProviderClient _client;

		public async ValueTask DisposeAsync()
		{
			await _client.DisposeAsync();
		}

		public async Task<IAsyncDisposable> Run(Configuration configuration)
		{
			_client = new ServiceProviderClient(configuration);

			// using a buffer of 1s and a buffer hold back delay of 5s
			var observer = await _client.GetLiveStreamObserver(500, 5000);

			// all handler
			observer.Subscribe(a =>
			{
				Console.WriteLine($"All-Handler: {a.EventArgs.Message.Id} : {a.EventArgs.Message.Timestamp} : {a.EventArgs.Message.Scope}");

				System.Threading.Thread.Sleep(10);

				a.EventArgs.Ack();
			});

			return this;
		}
	}
}
