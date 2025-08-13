/****** Object:  Table [dbo].[tbl_User]    Script Date: 8/11/2025 5:22:55 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tbl_User](
	[UserID] [int] IDENTITY NOT NULL,
	[UserName] [nvarchar](1000) NULL,
	[Password] [nvarchar](25) NULL,
	[CreateDate] [datetime] NULL,
	[LastModifiedDate] [datetime] NULL
) ON [PRIMARY]
GO


