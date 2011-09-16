# Steelmesh Command Line Interface (Mesh)

In essence, a Steelmesh application works and is prepared in a very similar manner to a standard [CouchApp](http://couchapp.org/).  The `mesh` command-line tool wraps the [node.couchapp.js](https://github.com/mikeal/node.couchapp.js) implementation and then does a few extra bits and pieces to make the couchapp Steelmesh compatible.

## Usage

First install the mesh package from npm:

```
npm install mesh
```

### Creating a Project

Then if you are starting a new project, you may like to scaffold a project using the init action:

```
mesh create
```

If you with to initialize a project in a directory other than the current directory, specify the path option:

```
mesh -p <path> create
```

### Publishing a Project

Publishing a project is as simple as running the following command:

```
mesh update
```

Well, it is if you are running a local CouchDB instance prepped to receive steelmesh apps.  In reality, you will probably want to set up a configuration file (see below) to point your application to the relevant couch server.  You can also use command-line switches to set the server also.

### Running in Development Mode

The local `mesh` command line tool also comes bundled with the required node modules to run a local development server.  This feature allows you to scaffold, build and test your apps locally before deploying them to a running steelmesh instance.

Simple run the following command:

```
mesh run
```

## Using Configuration Files

While not created by default, a `config.json` file can be provided in an application path and values in this file will be used when running mesh.  In terms of priority, options specified on the command-line have precedence, followed by values in the config file, then falling back to default values if not specified.

A sample configuration file is shown below:

```js
{
	"hostname": "couchdb.example.com",
	"port": 80,
	"app": "meshtest"
}
```

This would be a good example of interacting with a couchDB instance set to run on port 80. As outlined above, if you wanted to the details in the configuration file, but then override one specific value you could do that by supplying a value for the appropriate command-line option.  For example:

```
mesh --hostname couchdb2.example.com publish
```

### Configurable Options

Displayed below is a list of options that can be provided in a configuration file or from the command-line:

- __hostname__ (`--hostname`): The host on which CouchDB is running. Default is `localhost`.

- __port__ (`--port`): The port CouchDB is running on. Default is `5984`.

- __protocol__ (`--protocol`): The protocol being used to communicate with Couch. Default is `http`.

- __db__ (`--db`): The database that the application data will be pushed to. Default is `steelmesh`.  __NOTE:__ This is not the application that will be used to store application data but rather the db containing the steelmesh apps for distribution in the steelmesh cluster.  We generally recommend you don't change this setting...

- __app__ (`--app`): The id of the application being uploaded. The default for this is the name of project folder.  For example if your project resides in `meshapps/test` then the id of the app would be `test` by default.
