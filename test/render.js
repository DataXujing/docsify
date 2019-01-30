const path = require('path')

const {expect} = require('chai')

const loader = require('./_loader')

function expectSameDom(actual, expected) {
	const WHITESPACES_BETWEEN_TAGS = />(\s\s+)</g
	function replacer(match, group1) {
		return match.replace(group1, '')
	}
	expect(actual.replace(WHITESPACES_BETWEEN_TAGS, replacer).trim())
	.equal(expected.replace(WHITESPACES_BETWEEN_TAGS, replacer).trim())
}

describe('render', function() {
	it('important content (tips)', async function() {
		docsify = await loader()
  		const output = docsify.compiler.compile('!> **Time** is money, my friend!')
  		expect(output).equal('<p class="tip"><strong>Time</strong> is money, my friend!</p>')
	})

	describe('lists', function() {
		it('as unordered task list', async function() {
			docsify = await loader()
			const output = docsify.compiler.compile(`
- [x] Task 1
- [ ] Task 2
- [ ] Task 3`)
			expect(output, `<ul class="task-list">
				<li class="task-list-item"><label><input checked="" disabled="" type="checkbox"> Task 1</label></li>
				<li class="task-list-item"><label><input disabled="" type="checkbox"> Task 2</label></li>
				<li class="task-list-item"><label><input disabled="" type="checkbox"> Task 3</label></li>
			</ul>`)
		})

		it('as ordered task list', async function() {
			docsify = await loader()
			const output = docsify.compiler.compile(`
1. [ ] Task 1
2. [x] Task 2`)
			expectSameDom(output, `<ol class="task-list">
				<li class="task-list-item"><label><input disabled="" type="checkbox"> Task 1</label></li>
				<li class="task-list-item"><label><input checked="" disabled="" type="checkbox"> Task 2</label></li>
			</ol>`)
		})

		it('normal', async function() {
			docsify = await loader()
			const output = docsify.compiler.compile(`
- [linktext](link)
- just text`)
			expectSameDom(output, `<ul >
				<li><a href="#/link">linktext</a></li>
				<li>just text</li>
			</ul>`)
		})

		it('nested', async function() {
			docsify = await loader()
			const output = docsify.compiler.compile(`
- 1
- 2
  - 2 a
  - 2 b
- 3`)
			expectSameDom(output, `<ul >
				<li>1</li>
				<li>2<ul >
						<li>2 a</li>
						<li>2 b</li>
					</ul>
				</li>
				<li>3</li>
			</ul>`)
		})
	})

})
