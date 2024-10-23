﻿using System;
using System.Globalization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Picturepark.PressPortal.Demo.Configuration;
using Picturepark.SDK.V1.Authentication;
using Picturepark.SDK.V1.Contract.Authentication;

namespace Picturepark.PressPortal.Demo.Services
{
	public class PictureparkPerRequestServiceSettings: IPictureparkPerRequestServiceSettings
	{
		private IHttpContextAccessor _contextAccessor;

		public PictureparkPerRequestServiceSettings(PictureparkConfiguration config, IHttpContextAccessor httpContextAccessor)
		{
			_contextAccessor = httpContextAccessor;

			var accessToken = httpContextAccessor.HttpContext.GetTokenAsync("access_token").Result;

			var auth = new AccessTokenAuthClient(config.ApiBaseUrl, accessToken, config.CustomerAlias);
			AuthClient = auth;
			BaseUrl = config.ApiBaseUrl;
			CustomerAlias = config.CustomerAlias;
			HttpTimeout = TimeSpan.FromMinutes(10);
		    DisplayLanguage = CultureInfo.CurrentCulture.TwoLetterISOLanguageName;
		    IntegrationName = "PressPortal.Demo";
		}

		public string BaseUrl { get; }

		public TimeSpan HttpTimeout { get; }

		public IAuthClient AuthClient { get; }

		public string CustomerAlias { get; }

	    public string DisplayLanguage { get; }

	    public string IntegrationName { get; }
	}
}
