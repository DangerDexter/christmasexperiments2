function Path(data, material, name)
{
	this.data = data;

	this.nPts = this.data.data.length * 0.5;
	this.ribbonWidth = 15;
	this.triangles = 2 * (this.nPts - 1) * (this.ribbonWidth - 1);

	this.setVertices();
	this.setIndices();
	this.setOffests();

	this.geometry.offsets[0].count = this.triangles * 3;
	this.geometry.computeBoundingSphere();
	this.geometry.computeVertexNormals();
	this.geometry.offsets[0].count = this.nDisplayTriangles = 0;

	this.material = material;


	this.mesh = new THREE.Mesh( this.geometry, this.material );
}


Path.prototype = {
	setVertices : function()
	{

		this.geometry = new THREE.BufferGeometry();
		this.geometry.addAttribute( 'index', Uint16Array, this.triangles * 3, 1 );
		this.geometry.addAttribute( 'position', Float32Array, this.nPts * this.ribbonWidth, 3 );
		this.geometry.addAttribute( 'vertexID', Float32Array, this.nPts * this.ribbonWidth, 1 );



		var positions = this.geometry.attributes.position.array;
		var ids = this.geometry.attributes.vertexID.array;

		thickness = 150;
		for ( var i = 0; i < this.nPts; i++)
		{

			var ptId = 2 * i;
			for(var j = 0; j < this.ribbonWidth; j++)
			{
				var vertexID = this.ribbonWidth * i + j;
				var id = 3 * vertexID;
				var angle = 2 * Math.PI * j / (this.ribbonWidth - 1);
				positions[id]     = this.data.data[ptId];
				positions[id + 1] = -(this.data.data[ptId + 1]) + 0.5 * positions[id] + 0.03 * thickness * Math.cos(angle);
				positions[id + 2] = thickness * Math.sin(angle);
				

				ids[vertexID] = vertexID;
			}

		}

	},

	setIndices : function()
	{

		this.indices = this.geometry.attributes.index.array;

		for (var i = 0; i < this.nPts - 1; i++)
		{
			for(var j = 0; j < this.ribbonWidth - 1; j++)
			{
				var id = i * this.ribbonWidth + j;
				var idIndex = 6 * (i * (this.ribbonWidth -1 ) + j);
				this.indices[idIndex] = id;
				this.indices[idIndex + 1] = id + this.ribbonWidth;
				this.indices[idIndex + 2] = id + this.ribbonWidth + 1;

				this.indices[idIndex + 3] = id;
				this.indices[idIndex + 4] = id + this.ribbonWidth + 1;
				this.indices[idIndex + 5] = id + 1;

			}
		}
	},

	setOffests : function()
	{
		this.geometry.offsets = [{
			start: 0,
			index: 0,
			count: 0
		}];	
	},




	update : function()
	{
		if(this.nDisplayTriangles > this.triangles)return;
		this.geometry.offsets[0].count = this.nDisplayTriangles * 3;
		this.nDisplayTriangles += this.ribbonWidth;
	},

	updateShow : function(time)
	{
		var timeRatio = (time - this.data.delay0) / this.data.duration0;
		if(timeRatio < 0) timeRatio = 0;
		if(timeRatio > 1) timeRatio = 1;
		var nTriangles = 3 * Math.floor(timeRatio * this.triangles);
		this.geometry.offsets[0].start = 0;
		this.geometry.offsets[0].count = nTriangles;
	},

	updateHide : function(time)
	{
		var timeRatio = time / this.data.duration1;
		if(timeRatio < 0) timeRatio = 0;
		if(timeRatio > 1) timeRatio = 1;
		var nTriangles = 3 * Math.floor(timeRatio * this.triangles);
		this.geometry.offsets[0].start = nTriangles;
		this.geometry.offsets[0].count = 3 * this.triangles - nTriangles;
	}
}




var PathData0 = {
	dx:-500, dy:50,
	W : {delay0:0, duration0:50, duration1:25, data:[205,133,203,135,201,136,199,137,194,137,191,137,188,136,186,132,185,129,187,123,190,118,193,116,198,112,205,110,210,110,215,110,220,110,226,111,234,111,239,111,243,110,249,107,251,105,256,101,259,98,259,97,259,98,259,99,258,99,258,100,258,101,257,101,257,102,257,103,257,104,257,106,256,107,256,110,256,111,256,112,257,114,257,117,257,119,258,121,259,127,260,130,261,132,264,138,265,140,267,143,270,146,271,148,274,150,279,155,282,158,285,162,291,170,292,173,295,180,297,186,299,191,300,195,301,198,301,201,301,203,302,204,302,205,302,206,302,207,302,208,302,210,303,212,303,213,303,212,303,210,303,209,303,208,303,206,303,204,303,203,303,202,303,199,303,196,303,195,303,191,303,189,303,186,303,182,304,181,304,179,305,175,307,171,308,169,309,165,312,158,313,155,315,148,316,144,317,140,317,132,318,128,318,125,318,117,318,113,318,110,317,105,316,103,316,102,315,101,314,100,313,99,312,99,312,98,311,97,311,98,311,100,311,102,311,108,313,117,314,123,315,130,315,134,317,142,318,147,320,157,323,163,326,169,328,174,330,178,333,184,335,194,337,199,339,205,339,208,340,211,340,213,340,214,340,215,339,215,339,214,340,213,340,212,341,211,341,210,341,208,341,205,341,200,341,196,341,192,341,188,341,185,341,180,341,175,341,172,341,168,342,163,342,160,343,157,345,152,345,150,346,147,348,141,349,139,349,138,351,133,352,131,352,129,354,123,355,120,355,119,356,115,358,112,358,110,359,104,359,99,359,97,358,94,357,90,356,89,355,87,353,86,352,85,350,83,350,82,349,82,349,83,347,86]}, 
	e : {delay0:25, duration0:50, duration1:25, data:[357,172,356,172,359,173,364,174,370,172,373,170,375,167,375,165,374,163,371,161,368,159,364,159,359,160,354,161,351,163,348,167,347,171,347,177,348,186,350,192,354,198,360,201,369,202,379,202,385,202,393,199,403,193,408,190,411,187,413,184,414,184,413,184]},
	wish : {delay0:80, duration0:100, duration1:50, data:[485,170,483,171,482,172,481,172,480,172,478,172,477,171,476,169,475,168,475,167,475,166,475,165,476,163,476,162,477,161,478,160,479,159,481,158,482,157,485,156,487,156,489,156,491,156,493,156,494,156,497,156,498,157,499,158,501,159,503,159,504,160,506,162,507,163,509,164,510,166,511,167,513,168,514,170,515,171,516,172,517,174,518,176,519,177,520,178,521,180,522,183,523,185,524,188,525,190,526,192,526,194,526,195,527,196,527,197,527,198,528,200,529,202,530,205,531,206,532,207,533,207,534,208,535,208,537,208,538,207,540,206,542,205,543,203,544,202,545,200,546,198,548,195,548,193,549,191,550,188,551,185,552,180,552,177,553,174,553,170,553,168,552,165,551,163,550,161,549,160,549,159,548,159,547,158,546,159,546,162,546,164,546,166,546,170,547,174,547,178,548,183,549,188,550,192,552,197,553,200,555,202,557,204,558,206,559,206,561,207,562,208,563,209,565,210,567,209,569,208,570,207,572,204,574,201,575,197,576,195,577,191,577,188,577,184,577,181,576,178,575,175,574,173,573,171,572,169,572,168,570,167,570,166,569,166,568,166,569,166,571,166,574,166,576,167,580,166,583,166,585,165,586,164,588,162,589,161,590,161,592,158,594,156,595,154,596,153,596,152,597,151,597,150,598,149,598,148,598,150,597,151,597,154,596,159,596,164,596,169,596,172,596,176,596,180,596,184,597,187,598,189,600,192,602,193,604,195,608,195,612,195,616,195,621,194,624,193,628,191,630,189,636,183,641,178,643,176,645,170,647,165,648,163,650,159,651,157,650,156,650,155,649,155,649,158,650,162,651,167,653,170,655,174,658,177,660,179,662,181,663,184,665,189,666,191,667,193,668,195,668,199,668,202,668,206,667,208,665,211,662,214,659,216,657,217,654,217,652,217,648,217,645,215,645,214,645,213,647,212,653,209,658,207,662,205,669,202,675,199,681,196,688,193,694,188,701,181,707,174,713,165,718,155,721,143,723,132,724,125,724,119,724,114,723,113,718,114,715,116,711,120,706,129,703,142,701,154,692,179,687,192,686,201,686,207,685,210,684,212,683,213,684,209,687,204,690,199,695,192,703,185,708,182,714,180,719,180,722,181,723,186,722,196,721,203,721,209,726,213,733,213,746,213,756,210,763,206,768,201,776,195]}, 
	iDot : {delay0:130, duration0:100, duration1:50, data:[600,124,601,123,600,122,597,124,595,128,596,132,601,134,605,132,607,127,605,121,600,121,597,121]}, 
	y1 : {delay0:100, duration0:50, duration1:50, data:[402,310,401,310,400,309,399,309,398,307,396,305,394,302,393,295,393,289,393,283,395,275,398,271,401,268,405,264,410,262,416,262,422,266,427,269,432,275,439,284,443,291,447,297,453,306,456,311,458,318,462,327,465,332,468,338,471,345,474,351,478,358,483,364,487,369,491,374,494,377]}, 
	y2 : {delay0:100, duration0:80, duration1:80, data:[507,289,505,289,504,289,502,288,501,287,500,285,500,282,502,279,503,276,505,273,508,268,510,265,511,264,515,260,518,257,520,255,522,254,524,253,526,252,528,253,529,254,530,257,531,263,531,267,532,271,532,276,530,281,528,286,525,293,522,299,520,305,517,310,515,314,514,316,511,321,508,326,506,330,503,336,500,343,498,348,496,355,494,359,492,364,489,372,487,375,486,379,485,383,484,386,483,389,482,391,482,392,482,393,481,394,481,395,480,396,480,397,480,398,479,398,479,399,479,400,479,401,479,402,478,402,478,403,478,404,478,405,477,405,477,406,477,407,477,408,476,408,476,409,476,411,475,412,475,413,474,415,473,416,473,417,471,420,470,423,469,425,466,429,465,432,464,433,463,436,462,438,460,441,458,444,456,446,455,448,451,453,448,455,444,458,442,460,438,462,433,462,429,462,426,462,422,459,420,457,419,455,417,450,416,447,415,444,415,439,415,438,416,436,419,430,420,428,422,427,425,424,428,422,430,421,433,419,436,417,439,415,442,414,446,413,451,412,457,410,460,410,465,411,472,413,477,414,482,415,489,417,495,418,501,419,508,421,514,422,519,424,527,426,532,428,536,430,542,431,546,432,550,433,556,433,561,434,567,434,573,434,578,434,585,434,590,434,595,434,603,432,609,431,614,429,621,426,626,424,633,421,643,415,648,413,652,410,656,406,660,402,664,396,669,389,671,382,673,376,674,371,674,366,673,361,672,356,671,353,669,352,666,353,662,355]}, 
	ou : {delay0:130, duration0:80, duration1:80, data:[545,327,545,326,545,325,544,324,539,324,538,324,534,326,531,328,529,329,527,332,524,335,523,337,521,340,520,343,519,347,519,350,519,354,520,357,521,360,523,363,526,365,529,367,533,368,537,368,541,368,545,367,549,365,553,361,555,357,557,353,558,347,558,343,558,340,556,336,555,333,553,331,551,328,550,327,548,325,545,324,544,324,543,324,541,325,540,325,540,326,539,328,539,329,539,330,540,332,540,333,540,334,542,336,544,338,547,339,551,340,554,341,556,341,560,340,564,338,567,337,570,336,575,332,577,331,580,328,582,326,583,323,584,322,584,321,585,319,586,318,587,317,585,321,583,328,583,335,582,341,581,348,581,352,583,356,584,358,585,360,587,361,588,361,591,361,595,360,598,357,601,353,603,349,606,344,608,339,611,334,613,330,614,327,615,322,616,319,617,318,617,316,617,321,616,327,616,338,616,347,617,354,620,360,624,363,629,365,635,365,642,365,647,365]}, 
	a : {delay0:200, duration0:50, duration1:50, data:[514,485,514,483,513,483,511,483,508,483,504,484,501,486,497,488,495,489,492,492,491,493,490,495,489,498,489,501,490,504,492,509,493,512,496,514,502,516,507,517,511,516,518,514,522,511,524,506,525,500,524,496,522,492,522,489,522,487,522,486,522,484,522,483,522,485,523,490,523,496,524,503,525,508,527,512,530,516,532,519,536,521,542,522,548,522,554,520,561,516,572,511,577,508,580,506,581,506]}
}

var PathData1 = {
	dx:-400, dy:300,
	M : {delay0:0, duration0:60, duration1:30, data:[140,272,138,275,136,281,131,297,128,314,128,331,128,348,129,355,138,358,147,354,160,333,181,282,196,233,215,182,225,159,227,151,227,149,227,157,219,189,211,218,208,238,208,248,208,254,208,256,208,257,210,252,223,230,243,193,257,165,267,148,270,144,270,145,267,153,255,173,239,202,219,242,203,284,195,316,194,341,194,363,197,374,205,379,217,379,230,373,236,361,238,349,235,338,228,329,222,325,221,324]}, 
	erry : {delay0:30, duration0:100, duration1:50, data:[252,344,252,343,253,343,259,343,267,341,278,337,284,333,287,328,288,327,288,326,286,324,280,321,271,321,262,321,252,325,246,334,243,342,243,349,246,359,256,370,268,374,281,374,293,370,305,360,312,351,315,342,315,333,312,327,310,325,309,325,310,325,324,326,340,327,352,327,356,327,356,329,352,338,343,353,336,366,334,374,334,376,338,377,348,378,360,378,372,374,383,359,391,340,393,325,392,321,388,321,389,321,400,322,414,325,423,327,426,327,426,330,426,334,424,344,422,358,422,368,423,372,426,374,433,374,442,371,450,364,457,350,462,337,463,332,463,331,463,333,463,340,464,356,468,376,473,386,481,390,492,388,503,373,514,353,520,338,523,330,523,329,523,330,523,336,518,358,514,396,512,431,511,460,505,480,498,493,490,507,483,515,478,518,471,516,465,509,464,495,467,464,482,431,499,405,516,385,535,367,546,355,554,344,558,339,559,338,560,337]}, 
	C : {delay0:50, duration0:60, duration1:30, data:[88,358,88,359,88,366,88,381,93,407,105,430,121,448,146,462,176,474,205,478,233,479,248,473,256,464,256,453,252,440,243,430,228,423,201,420,176,420,150,429,130,440,116,449,106,460,100,470,96,490,95,509,95,525,95,545,100,560,105,571,112,583,119,593,126,602,132,607,141,611,150,615,159,618,176,620,196,620,214,620,227,615,236,608,240,605,242,602]}, 
	hristmas : {delay0:110, duration0:200, duration1:100, data:[226,612,227,611,240,596,255,579,272,554,285,521,294,492,299,462,300,437,300,421,299,415,295,413,287,420,273,452,259,490,251,528,248,574,247,606,244,625,242,635,241,637,241,635,242,623,253,595,265,579,277,574,284,574,290,577,295,590,297,604,299,616,300,626,301,631,302,633,304,633,315,633,329,628,338,604,341,582,341,573,338,573,335,573,339,573,350,571,355,571,356,571,356,572,356,583,356,599,355,614,355,625,361,629,364,630,377,624,386,612,391,605,394,597,397,591,397,589,397,586,397,592,397,608,398,623,406,636,422,639,433,616,438,591,441,571,441,567,441,564,443,564,449,571,459,582,466,593,470,606,468,617,459,624,443,627,434,627,439,627,451,626,463,619,475,601,484,582,491,569,498,553,502,542,504,533,506,525,507,521,507,533,504,558,500,579,497,595,495,610,494,620,494,627,498,634,504,638,511,638,520,630,531,619,538,607,543,600,547,596,549,596,550,596,552,597,554,607,555,621,554,632,553,639,553,634,556,613,566,592,573,583,578,579,583,579,587,587,590,600,590,610,590,616,589,617,589,615,590,612,592,612,592,607,592,598,593,590,597,584,604,581,612,580,617,580,619,582,622,588,624,596,626,610,632,624,637,630,640,631,646,631,659,627,666,621,670,616,673,613,675,611,677,608,681,604,682,603,681,604,679,607,673,617,672,625,672,633,672,639,679,641,687,643,693,644,700,640,712,628,716,616,713,602,705,596,700,593,695,593,693,593,698,593,708,599,718,605,723,613,730,623,739,632,747,635,749,634,749,618,751,598,751,581,751,576,750,575,750,576,760,587,772,601,782,613,785,619,789,628,796,638,800,649,777,656,744,657,728,653,723,649,721,647]}, 
	iDot : {delay0:220, duration0:20, duration1:10, data:[398,541,398,543,401,543,407,542,411,541,412,540,413,539,413,538,413,537,413,536,412,535,410,535,407,534,403,532,401,532,399,532,397,533,397,534,397,535,398,536,398,537,398,538]}, 
	tBar : {delay0:220, duration0:40, duration1:20, data:[467,552,476,552,504,543,536,530,572,528,597,529,604,532,606,534]}
};