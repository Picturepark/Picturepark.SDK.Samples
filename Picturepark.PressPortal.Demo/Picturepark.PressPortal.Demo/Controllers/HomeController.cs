﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using Picturepark.PressPortal.Demo.Configuration;
using Picturepark.PressPortal.Demo.Repository;
using Picturepark.PressPortal.Demo.Services;
using Picturepark.SDK.V1.Contract;
using System;
using System.Linq;
using System.Net;
using System.Net.Mime;
using System.Threading.Tasks;

namespace Picturepark.PressPortal.Demo.Controllers
{
	public class HomeController : Controller
	{
		private readonly IPictureparkAccessTokenService _client;
		private readonly IPressReleaseRepository _pressReleaseRepository;
		private readonly PictureparkConfiguration _configuration;

		public HomeController(IPictureparkAccessTokenService client, IPressReleaseRepository pressReleaseRepository, PictureparkConfiguration configuration)
		{
			_client = client;
			_pressReleaseRepository = pressReleaseRepository;
			_configuration = configuration;
		}

		public async Task<IActionResult> Overview()
		{
			var pressReleases = await _pressReleaseRepository.List(null, 30, string.Empty);

			return View(pressReleases);
		}

		public async Task<IActionResult> Detail(string id)
		{
			var detail = await _pressReleaseRepository.Get(id);
			return View(detail);
		}

		public RedirectResult Backend()
		{
			return Redirect(_configuration.ApiBaseUrl);
		}

		[ResponseCache(VaryByHeader = "User-Agent", Duration = 30)]
		public async Task<FileResult> Thumbnail(string id)
		{
			var thumbnailResponse = await _client.Content.DownloadThumbnailAsync(id, ThumbnailSize.Medium);
			return File(thumbnailResponse.Stream, "image/jpeg");
		}

		[ResponseCache(VaryByHeader = "User-Agent", Duration = 30)]
		public async Task<IActionResult> ImageResized(string id, [FromQuery] int width, [FromQuery] int height)
		{
			if (string.IsNullOrEmpty(id) || width <= 0 || height <= 0)
			{
				return BadRequest("Invalid request");
			}

			var fileResponse = await _client.Content.DownloadAsync(id, "Preview", width, height);
			return File(fileResponse.Stream, "image/jpeg");
		}

		[ResponseCache(VaryByHeader = "User-Agent", Duration = 30)]
		public async Task<FileResult> Download(string id)
		{
			var download = await _client.Content.DownloadAsync(id, "Original");
			var fileName = GetFileName(download);
			return File(download.Stream, "application/octet-stream", fileName);
		}

		[ResponseCache(VaryByHeader = "User-Agent", Duration = 30)]
		public async Task<FileResult> Embed(string id)
		{
			var download = await _client.Content.DownloadAsync(id, "Original");
			var fileName = GetFileName(download);
			return File(download.Stream, "application/octet-stream", fileName);
		}

		public IActionResult Error()
		{
			return View();
		}

		[HttpGet]
		public IActionResult SetLanguage(string culture, string returnUrl)
		{
			var requestCulture = new RequestCulture(culture);
			Response.Cookies.Append(
					CookieRequestCultureProvider.DefaultCookieName,
					CookieRequestCultureProvider.MakeCookieValue(requestCulture),
					new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
			);

			return LocalRedirect(returnUrl);
		}

		private string GetFileName(FileResponse response)
		{
			var disposition = response.Headers["Content-Disposition"].First();
			var composition = ContentDispositionHeaderValue.Parse(disposition);
			var fileName = WebUtility.UrlDecode(HeaderUtilities.RemoveQuotes(composition.FileName.Value).ToString());
			return fileName;
		}
	}
}
