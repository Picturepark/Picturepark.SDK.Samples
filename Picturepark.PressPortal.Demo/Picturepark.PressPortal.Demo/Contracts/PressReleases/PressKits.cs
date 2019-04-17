using Newtonsoft.Json;
using Picturepark.SDK.V1.Contract;
using Picturepark.SDK.V1.Contract.Attributes;
using System;
using System.Collections.Generic;

namespace Picturepark.PressPortal.Demo.Contracts
{
	public class PressKits
	{
		public TranslatedStringDictionary Headline { get; set; }

		public TranslatedStringDictionary Lead { get; set; }

		public TranslatedStringDictionary BodyText { get; set; }

		public Legend HeroImage { get; set; }
		public List<Legend> MediaDownloads { get; set; } = new List<Legend>();

		public DateTime ReleaseDate { get; set; }
	}
}
