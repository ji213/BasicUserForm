/*
    dbo.usp_userform_addupdate 
    add/update user form data based on input fields

    EXEC dbo.usp_userform_addupdate @nFirstName = ''
    , @nLastName = ''
    , @nEmail = ''
    , @nGender = ''
    , @dBirthdate = ''
    , @nSport = ''

*/
CREATE PROCEDURE dbo.usp_userform_addupdate 
(
    @nFirstName NVARCHAR(100)
    , @nLastName        NVARCHAR(100)
    , @nEmail           NVARCHAR(256)
    , @nGender          NVARCHAR(16) 
    , @nBirthDate       NVARCHAR(MAX)         
    , @nSport           NVARCHAR(50) 
  
)
AS
BEGIN

    DECLARE @dBirthdate DATE;


    SET @dBirthdate = CAST(@nBirthDate AS DATE);
    
    -- Add error handling if any of the input parameters are not supplied, especially email which is required to be unique


    -- Convert user input birthdate from string -> date

    


    -- Email address must be unique
    -- if email exists, update other fields

    IF EXISTS (SELECT TOP 1 1 
                FROM dbo.tbl_User_Form tuf 
                WHERE tuf.Email = @nEmail)
        BEGIN 

            -- Update only the one record
            UPDATE tuf
            SET  tuf.FirstName      = @nFirstName
            , tuf.LastName          = @nLastName
            , tuf.Gender            = @nGender
            , tuf.Birthdate         = @dBirthDate
            , tuf.Sport             = @nSport
            , tuf.LastModifiedDt    = GETDATE()
            FROM dbo.tbl_User_Form tuf
            WHERE tuf.Email = @nEmail



        END
    ELSE 
        BEGIN 
            -- if email doesnt exist, insert new record
            INSERT INTO dbo.tbl_User_Form 
            (  
                FirstName
                , LastName
                , Email
                , Gender
                , Birthdate
                , Sport
            )
            VALUES (@nFirstName, @nLastName, @nEmail, @nGender, @dBirthDate, @nSport)

        END

END;
GO