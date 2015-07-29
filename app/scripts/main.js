"use strict";
var React = require('react');

var BarChart = require('./../../lib/BarChart');

var Charts = React.createClass({
    render: function(){
        return(
            <div className='col-sm-12'>
                <div className='row'>
                    <div className='col-sm-6'>
                        <h4>Bar Chart</h4>
                        <BarChart height={400}/>
                        <hr/>
                        <button className="btn btn-warning" type="submit">Button</button>
                    </div>
                    <div className='col-sm-6'>
                        <h4>Using the component:</h4>
                        <p>Whenever this code is run, it recomputes the data join and maintains the desired correspondence between elements and data. If the new dataset is smaller than the old one, the surplus elements end up in the <i>exit</i> selection and get removed. If the new dataset is larger, the surplus data ends up in the <i>enter</i> selection and new nodes are added. If the new dataset is exactly the same size, then all the elements are simply updated with new positions, and no elements are added or removed.</p>
                        <p>Thinking with joins means your code is more <i>declarative</i>: you handle these three states without any branching (<code class="javascript"><span class="keyword">if</span></code>) or iteration (<code class="javascript"><span class="keyword">for</span></code>). Instead you describe how elements should correspond to data. If a given <i>enter</i>, <i>update</i> or <i>exit</i> selection happens to be empty, the corresponding code is a no-op.</p>
                        <p>Joins also let you target operations to specific states, if needed. For example, you can set constant attributes (such as the circle’s radius, defined by the <code class="javascript"><span class="string">"r"</span></code> attribute) on enter rather than update. By reselecting elements and minimizing DOM changes, you vastly improve rendering performance! Similarly, you can target animated transitions to specific states. For example, for entering circles to expand-in:</p>
                        <ol>
                            <li>
                                <p>First, <code class="javascript">svg.selectAll(<span class="string">"circle"</span>)</code> returns a new empty selection, since the SVG container was empty. The parent node of this selection is the SVG container.
                                </p>
                            </li>
                            <li>
                                <p>This selection is then joined to an array of data, resulting in three new selections that represent the three possible states: <i>enter</i>, <i>update</i>, and <i>exit</i>. Since the selection was empty, the update and exit selections are empty, while the enter selection contains a placeholder for each new datum.
                                </p>
                            </li>
                            <li>
                                <p>The update selection is returned by <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-data">selection.data</a>, while the enter and exit selections hang off the update selection; <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-enter">selection.enter</a> thus returns the enter selection.
                                </p>
                            </li>
                            <li>
                                <p>The missing elements are added to the SVG container by calling <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-append">selection.append</a> on the enter selection. This appends a new circle for each data point to the SVG container.
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
});

React.render(<Charts/>, document.getElementById('react-strahc'));
