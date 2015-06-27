## Hello task - csharp

* based on dnx

Since aspnet5 is still in beta, to use its HTTPClient, we need to tune the nuget config.

Change your `%AppData%\NuGet\NuGet.config` or `~/.config/NuGet/Nuget.config` to the following:

``` xml
<configuration>
  <packageSources>
    <add key="AspNetVNext" value="https://www.myget.org/F/aspnetvnext/api/v2/" />
    <add key="nuget.org" value="https://www.nuget.org/api/v2/" />
  </packageSources>
  <activePackageSource>
    <add key="Official NuGet Gallery" value="https://www.nuget.org/api/v2/" />
  </activePackageSource>
</configuration>
```

To run:

``` bash
$ dnu restore
$ dnx . run
```
