const COMPONENTS = require("../components_");
const { appendToTestFile, traverse_and_find } = require("../utils");
class Setter_Template {
	validate_content(p) {
		//  THAT AT LEAST ONE OF THE PARAMS IS ASSIGNMENT TO THE CLASS PARAMS
		let function_ = p[p.length - 1].value;

		// as constructors share the same function content as setters we return false if name is constructor

		if (traverse_and_find(COMPONENTS.Method_, p).key.name == "constructor") {
			return false;
		}

		let block_ = p[p.length - 1].value.body;
		if (!block_ || !function_ || !function_.params || !block_.body) {
			return false;
		}
		let validate = true;
		//Get function params
		let params = [];
		for (let p of function_.params) {
			params.push(p.name);
		}
		for (let blk of block_.body) {
			if (!blk.expression) {
				return false;
			}
			let assignment = blk.expression;
			if (
				params.includes(assignment.right.name) &&
				assignment.left.object.type == COMPONENTS.ThisExpression
			) {
				return true;
			}
		}
	}
	generateTestCase(p) {
		console.log("[GENERATING TEST CASE FOR  SETTER]");
		var testCase = " \n";
		var className = traverse_and_find(COMPONENTS.ClassDeclaration_, p).id.name;
		var functionName = traverse_and_find(COMPONENTS.Method_, p).key.name;
		var variable_to_set = traverse_and_find(COMPONENTS.Expression_, p)
			.expression.left.property.name;
		var instanceName = className.toLowerCase();

		testCase += `test('${functionName}', () => {  
		let ${instanceName}= new ${className}(1, 2); 
            ${instanceName}.${functionName}(3)
			expect(${instanceName}.${variable_to_set}).toBe(3);  
		});
		`;
		appendToTestFile(testCase);
	}
}

module.exports = Setter_Template;
