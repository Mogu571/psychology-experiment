// 心理学实验 - JavaScript文件
// 情绪词汇分类任务

// 初始化jsPsych
const jsPsych = initJsPsych({
    on_finish: function() {
        showDownloadPage();
    }
});

// 欢迎页面
const welcome = {
    type: jsPsychInstructions,
    pages: [
        '<h1>欢迎参加心理学实验</h1><p>感谢您参与我们的研究。</p><p>请仔细阅读说明并按照指示完成实验。</p>',
        '<h2>实验说明</h2><p>在接下来的实验中，您将看到一系列文字刺激。</p><p>请根据指示尽快做出反应。</p><p>整个实验大约需要5分钟。</p>'
    ],
    show_clickable_nav: true,
    button_label_next: '下一页',
    button_label_previous: '上一页',
    allow_keys: false
};

// 收集基本信息
const demographics = {
    type: jsPsychSurveyText,
    questions: [
        {prompt: "请输入您的年龄:", name: 'age', required: true},
        {prompt: "请输入您的性别 (男/女/其他):", name: 'gender', required: true},
        {prompt: "请输入您的ID (可选):", name: 'participant_id', required: false}
    ],
    button_label: '继续'
};

// 练习试次说明
const practice_instructions = {
    type: jsPsychInstructions,
    pages: [
        '<h2>练习阶段</h2><p>现在开始练习。</p><p>您将看到一些词语，如果看到"积极"词汇请按<strong>J</strong>键，如果看到"消极"词汇请按<strong>F</strong>键。</p><p>请尽快且准确地做出反应。</p>',
        '<h3>注意事项</h3><p>每个词语出现前会有一个"+"号，请注视这个符号。</p><p>看到词语后，请尽快判断并按键：</p><p><strong>积极词汇 → J键</strong></p><p><strong>消极词汇 → F键</strong></p>'
    ],
    show_clickable_nav: true,
    button_label_next: '开始练习'
};

// 练习试次刺激
const practice_stimuli = [
    {stimulus: '<div style="font-size: 48px;">快乐</div>', correct_response: 'j', valence: 'positive'},
    {stimulus: '<div style="font-size: 48px;">悲伤</div>', correct_response: 'f', valence: 'negative'},
    {stimulus: '<div style="font-size: 48px;">愉快</div>', correct_response: 'j', valence: 'positive'},
    {stimulus: '<div style="font-size: 48px;">痛苦</div>', correct_response: 'f', valence: 'negative'}
];

// 练习试次程序 - 修正版本，确保有注视点
const practice_procedure = {
    timeline: [
        // 1. 注视点 - 每个试次开始前显示
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="font-size: 60px; font-weight: bold;">+</div>',
            choices: "NO_KEYS",
            trial_duration: 500,
            data: {
                task: 'fixation',
                phase: 'practice'
            }
        },
        // 2. 刺激呈现 - 显示词汇并等待反应
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: jsPsych.timelineVariable('stimulus'),
            choices: ['f', 'j'],
            trial_duration: 2000,
            response_ends_trial: true,
            data: {
                task: 'practice',
                correct_response: jsPsych.timelineVariable('correct_response'),
                valence: jsPsych.timelineVariable('valence')
            },
            on_finish: function(data){
                data.correct = data.response == data.correct_response;
                data.rt = data.rt;
            }
        },
        // 3. 试次间间隔 - 空白屏幕
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="height: 50px;"></div>',
            choices: "NO_KEYS",
            trial_duration: 800,
            data: {
                task: 'inter_trial_interval',
                phase: 'practice'
            }
        }
    ],
    timeline_variables: practice_stimuli,
    randomize_order: true
};

// 正式实验说明
const test_instructions = {
    type: jsPsychInstructions,
    pages: [
        '<h2>正式实验</h2><p>练习结束，现在开始正式实验。</p><p>规则相同：积极词汇按<strong>J</strong>键，消极词汇按<strong>F</strong>键。</p><p>请保持专注并尽快做出反应。</p>',
        '<p>正式实验中同样会有"+"号注视点。</p><p>请在看到注视点时做好准备，词语出现后立即做出判断。</p><p>准备好了就开始吧！</p>'
    ],
    show_clickable_nav: true,
    button_label_next: '开始正式实验'
};

// 正式实验刺激
const test_stimuli = [
    {stimulus: '<div style="font-size: 48px;">幸福</div>', correct_response: 'j', valence: 'positive'},
    {stimulus: '<div style="font-size: 48px;">恐惧</div>', correct_response: 'f', valence: 'negative'},
    {stimulus: '<div style="font-size: 48px;">兴奋</div>', correct_response: 'j', valence: 'positive'},
    {stimulus: '<div style="font-size: 48px;">愤怒</div>', correct_response: 'f', valence: 'negative'},
    {stimulus: '<div style="font-size: 48px;">喜悦</div>', correct_response: 'j', valence: 'positive'},
    {stimulus: '<div style="font-size: 48px;">焦虑</div>', correct_response: 'f', valence: 'negative'},
    {stimulus: '<div style="font-size: 48px;">满足</div>', correct_response: 'j', valence: 'positive'},
    {stimulus: '<div style="font-size: 48px;">沮丧</div>', correct_response: 'f', valence: 'negative'}
];

// 正式实验程序 - 修正版本，确保有注视点
const test_procedure = {
    timeline: [
        // 1. 注视点
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="font-size: 60px; font-weight: bold;">+</div>',
            choices: "NO_KEYS",
            trial_duration: 500,
            data: {
                task: 'fixation',
                phase: 'test'
            }
        },
        // 2. 刺激呈现
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: jsPsych.timelineVariable('stimulus'),
            choices: ['f', 'j'],
            trial_duration: 3000,
            response_ends_trial: true,
            data: {
                task: 'test',
                correct_response: jsPsych.timelineVariable('correct_response'),
                valence: jsPsych.timelineVariable('valence')
            },
            on_finish: function(data){
                data.correct = data.response == data.correct_response;
                data.rt = data.rt;
            }
        },
        // 3. 试次间间隔
        {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: '<div style="height: 50px;"></div>',
            choices: "NO_KEYS",
            trial_duration: 1000,
            data: {
                task: 'inter_trial_interval',
                phase: 'test'
            }
        }
    ],
    timeline_variables: test_stimuli,
    randomize_order: true
};

// 结束页面
const debrief = {
    type: jsPsychInstructions,
    pages: [
        '<h2>实验结束</h2><p>感谢您的参与！</p><p>您的数据已经记录完毕。</p><p>请点击下方按钮下载您的数据文件。</p>'
    ],
    show_clickable_nav: true,
    button_label_next: '完成实验'
};

// 创建时间线
const timeline = [];
timeline.push(welcome);
timeline.push(demographics);
timeline.push(practice_instructions);
timeline.push(practice_procedure);
timeline.push(test_instructions);
timeline.push(test_procedure);
timeline.push(debrief);

// 显示下载页面的函数
function showDownloadPage() {
    // 获取所有数据
    const all_data = jsPsych.data.get();
    
    // 隐藏jsPsych容器
    document.getElementById('jspsych-content').style.display = 'none';
    
    // 创建下载页面
    const download_html = `
        <div class="download-container">
            <h2>🎉 实验完成！</h2>
            <p>感谢您的参与！您可以下载以下格式的数据文件：</p>
            
            <button class="download-btn" onclick="downloadCSV()">
                📊 下载CSV格式数据
            </button>
            
            <button class="download-btn" onclick="downloadJSON()">
                📄 下载JSON格式数据
            </button>
            
            <div style="margin-top: 30px;">
                <h3>数据预览</h3>
                <div id="data-preview" style="background: white; padding: 20px; border-radius: 5px; text-align: left; max-height: 300px; overflow: auto;">
                    <pre id="preview-content"></pre>
                </div>
            </div>
        </div>
    `;
    
    document.body.innerHTML = download_html;
    
    // 显示数据预览
    const preview = all_data.select(['task', 'stimulus', 'response', 'rt', 'correct', 'valence']).csv();
    document.getElementById('preview-content').textContent = preview;
}

// 下载CSV函数
function downloadCSV() {
    const csv = jsPsych.data.get().csv();
    const filename = 'psychology_experiment_data_' + new Date().toISOString().slice(0,19).replace(/:/g, '-') + '.csv';
    downloadFile(csv, filename, 'text/csv');
}

// 下载JSON函数
function downloadJSON() {
    const json = jsPsych.data.get().json(true);
    const filename = 'psychology_experiment_data_' + new Date().toISOString().slice(0,19).replace(/:/g, '-') + '.json';
    downloadFile(json, filename, 'application/json');
}

// 通用下载函数
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// 启动实验
console.log('开始加载实验...');
console.log('Timeline长度:', timeline.length);
console.log('练习程序timeline长度:', practice_procedure.timeline.length);
jsPsych.run(timeline);
