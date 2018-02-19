

// load jquery before angular
const $ = require("jquery");
const foo: any = window;
foo.$ = $;
foo.jQuery = $;

import * as angular from 'angular';
require('./node_modules/angular/angular.js');
import "angular-animate";
import "angular-cookies";
import "angular-touch";
import "angular-sanitize";
import "angular-resource";
import "angular-route";
import "codemirror";
import "angular-ui-bootstrap";
import "angular-ui-codemirror";
import "angular-aria";
import "angular-material";
import "angular-messages";
import "angular-moment";
import "angular-filter";
import "angular-dropdowns";
import "ng-lodash";
import "angular-dropdowns";
import "angular-uuid4";

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import * as jsonlint from 'jsonlint-mod';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import 'codemirror/addon/mode/simple';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/mode/dockerfile/dockerfile';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/selection/active-line';

import * as CodeMirror from 'codemirror'

// Make CodeMirror available globally so the modes' can register themselves.
let windowObject : any = window;
windowObject.CodeMirror = CodeMirror;
windowObject.jsonlint = jsonlint;


import "angular-file-upload";
//import "./node_modules/angular-ui-codemirror/src/ui-codemirror.js";
import "./node_modules/angular-gravatar/build/md5.min.js";
import "./node_modules/angular-gravatar/build/angular-gravatar.min.js";


