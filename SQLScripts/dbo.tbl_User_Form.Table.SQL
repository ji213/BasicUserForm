/****** Object:  Table [dbo].[tbl_User]    Script Date: 8/11/2025 5:22:55 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


--Work on what columns we will add to the form
CREATE TABLE [dbo].[tbl_User_Form](
	UserID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(256) UNIQUE NOT NULL,
    Gender NVARCHAR(16) NOT NULL,
    Birthdate DATE  NOT NULL,
    Sport NVARCHAR(50),
    CreatedDt DATETIME DEFAULT GETDATE()
) ON [PRIMARY]
GO


